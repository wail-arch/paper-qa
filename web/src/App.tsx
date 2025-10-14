import { Navigate, Route, Routes } from "react-router-dom";
import { useSession } from "./store/auth";
import Login from "./routes/Login";
import SenderHome from "./routes/sender/Home";
import SenderSend from "./routes/sender/Send";
import SenderHistory from "./routes/sender/History";
import RecipientHome from "./routes/recipient/Home";
import RecipientRequest from "./routes/recipient/Request";
import RecipientPay from "./routes/recipient/Pay";
import RecipientNearby from "./routes/recipient/Nearby";
import RecipientHistory from "./routes/recipient/History";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useSession();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/a/home"
        element={
          <RequireAuth>
            <SenderHome />
          </RequireAuth>
        }
      />
      <Route
        path="/a/send"
        element={
          <RequireAuth>
            <SenderSend />
          </RequireAuth>
        }
      />
      <Route
        path="/a/history"
        element={
          <RequireAuth>
            <SenderHistory />
          </RequireAuth>
        }
      />
      <Route
        path="/b/home"
        element={
          <RequireAuth>
            <RecipientHome />
          </RequireAuth>
        }
      />
      <Route
        path="/b/request"
        element={
          <RequireAuth>
            <RecipientRequest />
          </RequireAuth>
        }
      />
      <Route
        path="/b/pay"
        element={
          <RequireAuth>
            <RecipientPay />
          </RequireAuth>
        }
      />
      <Route
        path="/b/nearby"
        element={
          <RequireAuth>
            <RecipientNearby />
          </RequireAuth>
        }
      />
      <Route
        path="/b/history"
        element={
          <RequireAuth>
            <RecipientHistory />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
