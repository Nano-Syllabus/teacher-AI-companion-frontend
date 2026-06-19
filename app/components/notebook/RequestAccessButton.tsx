import { useState } from "react";
import { buildAccessRequestMailto } from "@/app/utils/mailToRequest";

type AccessType = "view" | "download" | "chat";

interface Props {
  teacherEmail: string;
  teacherName: string;
  studentName: string;
  studentEmail: string;
  notebookTitle: string;
}

export default function RequestAccessButton({
  teacherEmail,
  teacherName,
  studentName,
  studentEmail,
  notebookTitle,
}: Props) {
  const [accessType, setAccessType] = useState<AccessType>("view");
  const [message, setMessage] = useState("");

  const mailtoLink = buildAccessRequestMailto({
    teacherEmail,
    teacherName,
    studentName,
    studentEmail,
    notebookTitle,
    accessType,
    message,
  });

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800">Request Access</h3>

      {/* Access type selector */}
      <div className="flex gap-2">
        {(["view", "download", "chat"] as AccessType[]).map((type) => (
          <button
            key={type}
            onClick={() => setAccessType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              accessType === type
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-600 border-gray-300 hover:border-blue-400"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Optional message */}
      <textarea
        rows={3}
        placeholder="Add a message to the teacher (optional)..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   text-gray-700 resize-none focus:outline-none focus:ring-2
                   focus:ring-blue-500"
      />

      {/* Opens student's email client */}
      <a
        href={mailtoLink}
        className="inline-block text-center bg-blue-600 hover:bg-blue-700
                   text-white font-semibold text-sm px-4 py-2 rounded-lg
                   transition-colors"
      >
        Send Request via Email
      </a>
    
      <p className="text-xs text-gray-400">
        This will open your email app with a pre-filled message to the teacher.
      </p>

        </div>
  );
}