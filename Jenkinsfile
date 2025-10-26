[Pipeline] stage
[Pipeline] { (Deploy (CD))
[Pipeline] echo
Preparing to deploy to GitHub Pages branch...

// 1. Configure the identity (Already done, just keeping for context)
[Pipeline] sh
+ git config --global user.email jenkins@example.com
[Pipeline] sh
+ git config --global user.name Jenkins Automation Server

// 2. Checkout or create the gh-pages branch
[Pipeline] sh
+ git checkout -B gh-pages
Switched to a new branch 'gh-pages'

// 3. Add all files
[Pipeline] sh
+ git add -A

// 4. Commit - We use '|| true' to prevent the pipeline from failing 
//    if there's nothing to commit. 'nothing to commit' gives exit code 1.
[Pipeline] sh
+ git commit -m "Deployment from Jenkins CI/CD pipeline [skip ci]" || true

// 5. Deployment Push (Requires Credentials)
// Replace 'github-pat-for-push' with the actual ID of your GitHub Token credential.
[Pipeline] withCredentials([string(credentialsId: 'github-pat-for-push', variable: 'GITHUB_TOKEN')]) {
    [Pipeline] sh
    // The token is safely used to authenticate the push command
    + git push -f https://oauth2:${GITHUB_TOKEN}@github.com/skmen/automation-demo-site.git gh-pages
}

[Pipeline] }
[Pipeline] // stage