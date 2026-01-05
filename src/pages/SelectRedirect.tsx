import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SelectRedirect() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  useEffect(() => {
    if (type) {
      navigate(`/armor?type=${type}`);
    }
  }, [type, navigate]);

  return <div>Redirecting...</div>;
}
