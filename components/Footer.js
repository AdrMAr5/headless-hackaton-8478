import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Discover the journey of a lifetime.</p>
      <span>
        The Wild Atlantic Way &copy; {new Date().getFullYear()} | Powered by{" "}
        <a href="https://wpengine.com" target="_blank" rel="noopener noreferrer">
          WP Engine
        </a>
      </span>
    </footer>
  );
}