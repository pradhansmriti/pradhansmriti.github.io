# Setting Up Comments for Your Hugo Website

I've implemented two comment systems for your website. Choose one:

## Option 1: Giscus (Recommended)
Giscus uses GitHub Discussions and is more modern with better features.

### Setup Steps:
1. **Enable GitHub Discussions** on your repository:
   - Go to your repo: https://github.com/pradhansmriti/pradhansmriti.github.io
   - Go to Settings > General
   - Scroll down to "Features" section
   - Check "Discussions"

2. **Get Giscus Configuration**:
   - Visit https://giscus.app/
   - Enter your repository: `pradhansmriti/pradhansmriti.github.io`
   - Choose "Discussion title contains page pathname"
   - Select a category (or create one called "Blog Comments")
   - Copy the generated values

3. **Update hugo.yaml**:
   - Replace the empty `repoId` and `categoryId` values with what you got from giscus.app
   - The configuration is already in your `hugo.yaml` file

## Option 2: Utterances (Simpler)
Uses GitHub Issues instead of Discussions.

### Setup Steps:
1. **Install Utterances App**:
   - Go to https://github.com/apps/utterances
   - Click "Install" and select your repository

2. **Switch to Utterances**:
   In your `layouts/partials/comments.html`, replace the content with:
   ```html
   {{ partial "comments-utterances.html" . }}
   ```

3. **Update Configuration**:
   In `hugo.yaml`, comment out the giscus section and uncomment the utterances section.

## Testing
1. Build your site locally: `hugo server`
2. Navigate to a blog post
3. You should see the comment section at the bottom

## Notes
- Comments will only appear on blog posts (in the `/post/` section)
- Visitors need a GitHub account to comment
- Comments are stored in your GitHub repository (Discussions or Issues)
- You can moderate comments through GitHub's interface

## Customization
You can modify the styling in the comments partials by updating the `<style>` section.
