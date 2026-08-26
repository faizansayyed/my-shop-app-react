import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="message-page">
      <h2>404 - Page not found</h2>
      <Link to="/">Back to home</Link>
    </section>
  );
}
