import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";

const Modal = ({ isOpen, onClose, subdomain }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(subdomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceed = () => {
    onClose();
    navigate("/signin");
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
      >
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Your Dashboard Is Ready!</DialogTitle>
            <DialogDescription>
              Here's your unique subdomain for accessing AgriPass. Save this
              link to log in to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="domain" className="sr-only">
                Your Subdomain
              </Label>
              <Input
                id="domain"
                readOnly
                value={subdomain}
                className="bg-muted/50"
              />
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleCopy}
              className="bg-blue-500 hover:bg-blue-800 text-white"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-between mt-4">
            <DialogDescription className="text-xs text-muted-foreground">
              Use this link to access your dashboard anytime.
            </DialogDescription>
            <Button
              onClick={handleProceed}
              className="bg-blue-500 hover:bg-blue-800 text-white"
            >
              Proceed to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default Modal;
