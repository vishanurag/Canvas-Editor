const repoOwner = "vishanurag";
const repoName = "Canvas-Editor";
const contributorsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
const repoUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

async function fetchContributorData() {
  try {
    const contributors = [];
    let page = 1;
    let response;

    // Fetch contributors across multiple pages
    do {
      response = await fetch(`${contributorsUrl}?page=${page}&per_page=100`);
      const contributorsData = await response.json();
      contributors.push(...contributorsData);
      page++;
    } while (response.headers.get('link') && response.headers.get('link').includes('rel="next"')); // Check for next page

    const repoRes = await fetch(repoUrl);
    const repoData = await repoRes.json();

    const statsGrid = document.getElementById("statsGrid");

    statsGrid.innerHTML = `
      <div class="contributor-stat-card"><h3>${contributors.length}</h3><p>Contributors</p></div>
      <div class="contributor-stat-card"><h3>${contributors.reduce((sum, { contributions }) => sum + contributions, 0)}</h3><p>Total Contributions</p></div>
      <div class="contributor-stat-card"><h3>${repoData.stargazers_count}</h3><p>GitHub Stars</p></div>
      <div class="contributor-stat-card"><h3>${repoData.forks_count}</h3><p>Forks</p></div>
    `;

    const contributorsContainer = document.getElementById("contributors");
    contributorsContainer.innerHTML = contributors.map(({ login, contributions, avatar_url, html_url }) => `
      <div class="contributor-card">
        <img src="${avatar_url}" alt="${login}'s avatar">
        <p><strong>${login}</strong></p>
        <p>Contributions: ${contributions}</p>
        <a href="${html_url}" target="_blank">GitHub Profile</a>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchContributorData();
