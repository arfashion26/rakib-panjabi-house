import { redirect } from "next/navigation";

// Registration is automatic when placing an order.
// Redirect to login page which explains this.
export default function RegisterPage() {
  redirect("/login");
}
