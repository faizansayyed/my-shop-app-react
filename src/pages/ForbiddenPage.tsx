import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <section className="message-page">
      <h2>403 - Access denied</h2>
      <p>This page is available to admin accounts only.</p>
      <Link to="/products">Back to products</Link>
    </section>
  );
}
