import { useState } from "react";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import "./AdminPage.css";

function AdminPage() {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [taskId, setTaskId] = useState<string>("");

  const generateQrCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowForm(false);
  };

  return (
    <>
      {showForm ? (
        <>
          <h1>Generate QR Code</h1>
          <form onSubmit={(e) => generateQrCode(e)}>
            <div className="generate-qr-code-form">
              <CustomInput
                type="text"
                value={taskId}
                required
                placeholder="TaskId"
                onChange={(e) => setTaskId(e.target.value)}
              />
              <CustomButton label="Generate QR Code" variant="initial" />
            </div>
          </form>
        </>
      ) : (
        <>
          <QRCode
            size={300}
            value={`http://192.168.1.223:5173/currentchallenge?id=${taskId}`}
          />
          <h1>{`${window.location.host}/currentchallenge?id=${taskId}`}</h1>
        </>
      )}
    </>
  );
}

export default AdminPage;
