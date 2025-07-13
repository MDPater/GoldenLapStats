function LandingPage() {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4 text-center">Welcome to Golden Lap Stats</h1>
      <div className="card p-4 shadow-sm">
        <h4>What is this?</h4>
        <p>
          This site is used to <strong>visualize data</strong> from a{" "}
          <em>Golden Lap</em> save file. It helps you track your drivers, teams,
          race weekends, and statistics in a clean and interactive format.
        </p>

        <p>
          <strong>Golden Lap</strong> is a game by Mayhem Games. You can check
          it out on Steam:{" "}
          <a
            href="https://store.steampowered.com/app/2052040/Golden_Lap/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steam Page
          </a>
          .
        </p>

        <h4 className="mt-4">How to Get Your Save File</h4>
        <p>To locate your Golden Lap save file:</p>
        <ol>
          <li>
            Navigate to this folder on your PC:
            <pre className="bg-dark p-2 mt-2">
              C:\Users\*yourname*\Documents\My Games\Golden Lap\Saves
            </pre>
          </li>
          <li>
            Inside that folder, you’ll find a file named like:
            <pre className="bg-dark p-2 mt-2">*your saved game name*.json</pre>
          </li>
          <li>
            Upload that file using the <strong>Upload Save File</strong> button
            to begin exploring your season stats.
          </li>
        </ol>

        <h4 className="mt-4">Other Controls</h4>
        <ul>
          <li>
            <strong>Load Test Data</strong>: Loads a sample Golden Lap save file
            from the developer. This is great for demo or testing purposes if
            you don’t have a save file ready.
          </li>
          <li>
            <strong>Delete Data</strong>: Clears the current save file from the
            app’s memory and resets the view.
          </li>
        </ul>

        <p className="mt-4 text-muted">
          Note: All data stays in your browser — nothing is stored or uploaded.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
