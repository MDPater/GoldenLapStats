function Footer() {
  return (
    <footer className="text-center py-4 bg-dark mt-5 border-top text-light">
      <div className="container d-flex flex-column align-items-center gap-2">
        <span>
          Developed by <strong>Max de Pater</strong>
        </span>
        <div className="d-flex gap-3">
          <a
            href="https://github.com/MDPater/GoldenLapStats"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark d-inline-flex align-items-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt="GitHub"
              style={{ width: "20px", height: "20px" }}
            />
            View on GitHub
          </a>
          <a
            href="/privacy"
            className="btn btn-outline-light btn-sm d-inline-flex align-items-center"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
