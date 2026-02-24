import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Kickoff Arena</h1>
          <p>
            This workspace hosts the FootballVerse experience. Run the
            FootballVerse app to view the full site.
          </p>
        </div>
      </main>
    </div>
  );
}
