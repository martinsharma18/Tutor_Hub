import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Download, Trash2, ShieldAlert, MailCheck } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import PageHeader from "../components/ui/PageHeader";
import { accountApi } from "../features/account/api";
import { authApi } from "../features/auth/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, selectCurrentUser } from "../store/authSlice";

const CONFIRM_PHRASE = "DELETE";

const AccountSettingsPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");

  const exportMutation = useMutation({
    mutationFn: accountApi.exportData,
    onSuccess: (data) => {
      // Hand the JSON straight to the browser as a download rather than rendering it.
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `best-tuitions-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Your data has been downloaded.");
    },
    onError: () => toast.error("Could not export your data."),
  });

  const verifyMutation = useMutation({
    mutationFn: authApi.requestEmailVerification,
    onSuccess: () => toast.success("Verification email sent — check your inbox."),
    onError: () => toast.error("Could not send verification email."),
  });

  const deleteMutation = useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: () => {
      toast.success("Your account has been deleted.");
      dispatch(logout());
      navigate("/");
    },
    onError: (err) =>
      toast.error(err.response?.data?.detail ?? "Could not delete your account."),
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8 max-w-3xl">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your email verification, download your data, or close your account."
        icon={ShieldAlert}
      />

      {!user?.emailVerified && (
        <SectionCard title="Verify your email">
          <p className="text-sm text-slate-600 mb-4">
            Your email address isn't verified yet. Verifying helps us confirm it's really you and
            lets us reach you about applications and demo requests.
          </p>
          <button
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <MailCheck className="h-4 w-4" />
            {verifyMutation.isPending ? "Sending…" : "Send verification email"}
          </button>
        </SectionCard>
      )}

      <SectionCard title="Download your data">
        <p className="text-sm text-slate-600 mb-4">
          Get a copy of everything we hold about you — your profile, posts, applications, demo
          requests, payment records, messages, and reviews — as a JSON file.
        </p>
        <button
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exportMutation.isPending ? "Preparing…" : "Download my data"}
        </button>
      </SectionCard>

      <SectionCard title="Delete your account" className="border-rose-200">
        <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 mb-4">
          <p className="text-sm text-rose-800 font-semibold mb-2">This cannot be undone.</p>
          <p className="text-sm text-rose-700">
            Your name, email, phone number, and profile details will be permanently erased, and you
            won't be able to sign in again. Records of completed payments and commission are kept
            in anonymized form because we're required to retain them for accounting purposes.
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm
        </label>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-400 mb-4"
        />

        <div>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={confirmText !== CONFIRM_PHRASE || deleteMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            {deleteMutation.isPending ? "Deleting…" : "Permanently delete my account"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
};

export default AccountSettingsPage;
