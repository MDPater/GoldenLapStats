import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Privacy() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main
        className="container py-5"
        style={{ maxWidth: "700px", flexGrow: 1 }}
      >
        <h1 className="mb-4">Privacy Policy</h1>

        <section
          className="bg-dark p-4 rounded"
          style={{
            border: "2px solid #ccc",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            This web application processes your Golden Lap save file entirely
            within your browser.{" "}
            <strong>
              No data is uploaded, transmitted, or stored externally.
            </strong>{" "}
            Your save file remains solely on your device, ensuring you retain
            full control over your personal data at all times.
          </p>

          <p>
            We do not collect, share, or sell any personal or game-related
            information. All file parsing and data visualization are performed
            locally and securely on your device, with no connection to external
            servers.
          </p>

          <h2 className="mt-4 mb-3">Your Data Security</h2>
          <p>
            Since all processing happens client-side, there is no risk of your
            save files or personal data being exposed to third parties. We
            prioritize your privacy and security, and no tracking or analytics
            scripts are included in this app.
          </p>

          <h2 className="mt-4 mb-3">Cookies and Tracking</h2>
          <p>
            This application does not use cookies or any other tracking
            technologies.
          </p>

          <h2 className="mt-4 mb-3">Contact</h2>
          <p>
            If you have any questions about this privacy policy or how your data
            is handled, please contact the developer at{" "}
            <a href="mailto:dev.maxdepater@gmail.com">
              dev.maxdepater@gmail.com
            </a>
            .
          </p>
        </section>

        <Link to="/" className="btn btn-outline-primary mt-4">
          &larr; Back to Home
        </Link>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default Privacy;
