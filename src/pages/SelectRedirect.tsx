import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SelectRedirect() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  const location = useLocation();
  // This function extracts existing query parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.toString(); // Returns the query string
  };

  if (type === "decoration") {
    console.log("getQueryParams", getQueryParams())
    useEffect(() => {
      if (type) {
        navigate(`/decorations?${getQueryParams()}`);
      }
    }, [type, navigate]);
  }

  else {
    useEffect(() => {
      if (type) {
        navigate(`/armor?type=${type}`);
      }
    }, [type, navigate]);
  }

  return <div>Redirecting...</div>;
}
