"use client";

import { useSearchParams } from "next/navigation";
import RequestForm from "@/components/request-form";

export default function TeacherRequestPage() {
  const searchParams = useSearchParams();
  const messageParam = searchParams.get("message");

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {messageParam === "apply_now" && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl text-sm">
          👋 Bienvenue ! Remplissez le formulaire ci-dessous pour soumettre votre dossier de candidature.
        </div>
      )}
      
      <RequestForm />
    </div>
  );
}