function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {currentYear} <span>Sunny Singh Rajput</span>. All rights reserved.
      </p>
      <p className="footer-tagline">
        Freelance Full Stack Developer · Mumbai, India
      </p>
    </footer>
  );
}

export default Footer;
