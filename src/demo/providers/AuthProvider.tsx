import React, { useEffect, useState } from "react";
import { ExternalUser, KYCPayload, KYCVC } from "@tonomy/tonomy-id-sdk";
import { useNavigate, useLocation } from "react-router-dom";

interface KycDataInterface {
  kyc?: {
    value: KYCPayload;
    verifiableCredential: KYCVC;
  };
}

interface AuthContextType {
  user: ExternalUser | null;
  kycData: KycDataInterface | null;
  signin: (user: ExternalUser) => void;
  signKycData: (data: KycDataInterface) => void;
  signout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [kycData, setKycData] = useState<KycDataInterface | null>(null);

  const navigation = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const signout = async () => {
    await user?.logout();
    navigation("/");
  };

  const signKycData = async (data: KycDataInterface) => {
    setKycData(data);
    if (data && data.kyc) {
      console.log("Raw login data:", data);
      setKycData(data);
    } else {
      setKycData(null);
    }
  };

  const signin = (user: ExternalUser) => {
    setUser(user);
    navigation("/user-home");
  };

  const value = { user, kycData, signout, signin, signKycData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
