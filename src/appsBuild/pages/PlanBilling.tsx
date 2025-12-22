import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LayersIcon from "@mui/icons-material/Layers";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { useApps } from "../context/AppsContext";
import "./PlanBilling.css";

export default function PlanBilling() {
  const { username } = useParams();
  const { getAppByUsername, updateAppPlan } = useApps();
  const app = username ? getAppByUsername(username) : undefined;

  const currentPlan = app?.plan || "basic";
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const activeUsers = 250; // Stub value
  const ramGB = (app?.smartContract?.ramPurchasedMB || 0) / 1024;
  const costPerUser = 0.05;
  const costPerGB = 50;
  const usersCost = activeUsers * costPerUser;
  const ramCost = ramGB * costPerGB;
  const totalMonthlyCost = usersCost + ramCost;

  const billingHistory = [
    { type: "5 GB of storage", price: "$25", date: "27.03.2025" },
    { type: "Pro subscription", price: "$100", date: "27.03.2025" },
  ];

  const handleUpgradeToPro = async () => {
    if (username && app) {
      await updateAppPlan(username, "pro");
    }
  };

  const handleDowngradeToBasic = async () => {
    if (username && app) {
      await updateAppPlan(username, "basic");
    }
  };

  const handleDowngradeClick = () => {
    setShowDowngradeConfirm(true);
  };

  return (
    <div className="plan-billing">
      {/* Pricing Plans Section */}
      <section className="pricing-section">
        <div className="pricing-cards">
          {/* Basic Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <div className="plan-icon plan-icon-basic">
                <LayersIcon />
              </div>
              <div className="plan-info">
                <h3 className="plan-name">Basic</h3>
                <p className="plan-description">
                  Ideal for small projects and early-stage teams
                </p>
              </div>
            </div>

            <div className="plan-price">
              <span className="price-amount">$0</span>
            </div>

            <ul className="plan-features">
              <li>
                <CheckIcon className="feature-check" />
                <span>Single Sign-On</span>
              </li>
              <li>
                <CheckIcon className="feature-check" />
                <span>Digital Signature</span>
              </li>
            </ul>

            <div className="plan-footer">
              {currentPlan === "basic" ? (
                <div className="current-plan-badge">Your current plan</div>
              ) : (
                <button
                  className="downgrade-button"
                  onClick={handleDowngradeClick}
                >
                  Downgrade to Basic
                </button>
              )}
              {currentPlan === "pro" && (
                <div className="downgrade-note">
                  Downgrading removes access to Smart Contracts, Signing Keys,
                  and Web3 Transactions.
                </div>
              )}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card pricing-card-pro">
            <div className="plan-header">
              <div className="plan-icon plan-icon-pro">
                <WorkspacePremiumIcon />
              </div>
              <div className="plan-info">
                <h3 className="plan-name">Pro</h3>
                <p className="plan-description">
                  Perfect for scaling apps and growing businesses
                </p>
              </div>
            </div>

            <div className="plan-price">
              <span className="price-amount price-amount-pro">$0.05</span>
              <span className="price-period">/ user / month</span>
            </div>

            <ul className="plan-features">
              <li>
                <CheckIcon className="feature-check feature-check-pro" />
                <span>Everything from Basic</span>
              </li>
              <li>
                <CheckIcon className="feature-check feature-check-pro" />
                <span>Web3 Transactions</span>
              </li>
              <li>
                <CheckIcon className="feature-check feature-check-pro" />
                <span>Smart Contracts</span>
              </li>
              <li>
                <CheckIcon className="feature-check feature-check-pro" />
                <span>Signing Keys</span>
              </li>
            </ul>

            <div className="plan-footer">
              {currentPlan === "pro" ? (
                <div className="current-plan-badge">Your current plan</div>
              ) : (
                <button className="upgrade-button" onClick={handleUpgradeToPro}>
                  Upgrade to PRO
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {currentPlan === "pro" && (
        <section className="cost-calculator">
          <h3 className="section-title">Estimate monthly cost</h3>
          <div className="calculator-card">
            <div className="invoice-table">
              <div className="invoice-header">
                <div className="invoice-col invoice-col-desc">Description</div>
                <div className="invoice-col invoice-col-qty">Quantity</div>
                <div className="invoice-col invoice-col-unit">Unit Price</div>
                <div className="invoice-col invoice-col-total">Total</div>
              </div>
              <div className="invoice-row">
                <div className="invoice-col invoice-col-desc">Active users</div>
                <div className="invoice-col invoice-col-qty">{activeUsers}</div>
                <div className="invoice-col invoice-col-unit">
                  ${costPerUser.toFixed(2)}/user
                </div>
                <div className="invoice-col invoice-col-total">
                  ${usersCost.toFixed(2)}
                </div>
              </div>
              {ramGB > 0 && (
                <div className="invoice-row">
                  <div className="invoice-col invoice-col-desc">
                    Storage (RAM)
                  </div>
                  <div className="invoice-col invoice-col-qty">
                    {ramGB.toFixed(2)} GB
                  </div>
                  <div className="invoice-col invoice-col-unit">
                    ${costPerGB}/GB
                  </div>
                  <div className="invoice-col invoice-col-total">
                    ${ramCost.toFixed(2)}
                  </div>
                </div>
              )}
              <div className="invoice-total-row">
                <div className="invoice-col invoice-col-desc"></div>
                <div className="invoice-col invoice-col-qty"></div>
                <div className="invoice-col invoice-col-unit">Total</div>
                <div className="invoice-col invoice-col-total">
                  ${totalMonthlyCost.toFixed(2)}
                </div>
              </div>
            </div>
            <p className="calculator-note">
              Plan payments are paid in TONO to the Tonomy network governance
              address{" "}
              <a
                target="_blank"
                href="https://explorer.tonomy.io/accounts/gov.tmy"
              >
                gov.tmy
              </a>
              , which is democratically governed to allocate funds to
              contributors, operators, and projects in the Tonomy ecosystem.
            </p>
          </div>
        </section>
      )}

      {/* Billing History Section */}
      <section className="billing-history-section">
        <h3 className="section-title">Billing History</h3>
        <div className="billing-table">
          <div className="table-header">
            <div className="table-col col-type">Type</div>
            <div className="table-col col-price">Price</div>
            <div className="table-col col-date">Date</div>
            <div className="table-col col-actions"></div>
          </div>
          {billingHistory.map((item, index) => (
            <div key={index} className="table-row">
              <div className="table-col col-type">{item.type}</div>
              <div className="table-col col-price">{item.price}</div>
              <div className="table-col col-date">{item.date}</div>
              <div className="table-col col-actions">
                <IconButton size="small" className="row-menu-button">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog
        open={showDowngradeConfirm}
        onClose={() => setShowDowngradeConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <div className="downgrade-modal">
          <h3>Downgrade to Basic?</h3>
          <p>
            You will lose access to Smart Contracts, Signing Keys, and Web3
            Transactions. Existing contracts and keys will be disabled.
          </p>
          <div className="downgrade-actions">
            <Button onClick={() => setShowDowngradeConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDowngradeToBasic();
                setShowDowngradeConfirm(false);
              }}
            >
              Confirm downgrade
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
