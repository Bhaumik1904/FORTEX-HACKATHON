import { createBrowserRouter } from "react-router";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { StudentLayout } from "./components/student/StudentLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { SubmitComplaint } from "./components/student/SubmitComplaint";
import { MyComplaints } from "./components/student/MyComplaints";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ComplaintDetail } from "./components/admin/ComplaintDetail";
import { SignalAnalysis } from "./components/admin/SignalAnalysis";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: SubmitComplaint },
      { path: "my-complaints", Component: MyComplaints },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "complaint/:id", Component: ComplaintDetail },
      { path: "signal-analysis", Component: SignalAnalysis },
    ],
  },
]);
