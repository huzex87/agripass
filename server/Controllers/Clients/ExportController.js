const {
  BeneficiaryApplication,
  Disbursement,
  Project,
} = require("../../Database_Models/Models");
const { toCSV } = require("../../utils/csv");

const sendCSV = (res, filename, headers, rows) => {
  const csv = toCSV(headers, rows);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
};

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

// Export every application for the calling cooperative as CSV.
const exportApplications = async (req, res) => {
  try {
    const applications = await BeneficiaryApplication.find({
      organizationId: req.organization._id,
    })
      .populate([{ path: "beneficiaryId" }, { path: "projectId" }])
      .sort({ createdAt: -1 });

    const headers = [
      "Farmer Name",
      "Farmer ID",
      "Email",
      "Phone",
      "State",
      "LGA",
      "Ward",
      "Project",
      "Status",
      "Applied On",
    ];
    const rows = applications.map((a) => {
      const b = a.beneficiaryId || {};
      const pd = b.personalDetails || {};
      const loc = b.location || {};
      return [
        `${pd.firstName || ""} ${pd.lastName || ""}`.trim(),
        b.farmerIdNumber || "",
        pd.email || "",
        pd.phone || "",
        loc.state || "",
        loc.lga || "",
        loc.ward || "",
        a.projectId?.name || "",
        a.status || "",
        fmtDate(a.createdAt),
      ];
    });

    return sendCSV(res, "applications.csv", headers, rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Export the repayment ledger (one row per installment) for the cooperative.
const exportRepayments = async (req, res) => {
  try {
    const projects = await Project.find({ organizationId: req.organization._id }).select("_id name");
    const projectMap = new Map(projects.map((p) => [p._id.toString(), p.name]));
    const projectIds = projects.map((p) => p._id);

    const disbursements = await Disbursement.find({ projectId: { $in: projectIds } })
      .populate("beneficiaryId", "personalDetails farmerIdNumber")
      .sort({ createdAt: -1 });

    const headers = [
      "Farmer Name",
      "Farmer ID",
      "Project",
      "Installment Type",
      "Amount",
      "Paid Amount",
      "Status",
      "Due Date",
      "Paid At",
    ];
    const rows = [];
    disbursements.forEach((d) => {
      const b = d.beneficiaryId || {};
      const pd = b.personalDetails || {};
      const name = `${pd.firstName || ""} ${pd.lastName || ""}`.trim() || "Unknown";
      (d.repaymentSchedule || []).forEach((inst) => {
        rows.push([
          name,
          b.farmerIdNumber || "",
          projectMap.get(d.projectId?.toString()) || "",
          inst.repaymentType || "",
          inst.amount ?? "",
          inst.paidAmount ?? 0,
          inst.status || "",
          fmtDate(inst.dueDate),
          fmtDate(inst.paidAt),
        ]);
      });
    });

    return sendCSV(res, "repayments.csv", headers, rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { exportApplications, exportRepayments };
