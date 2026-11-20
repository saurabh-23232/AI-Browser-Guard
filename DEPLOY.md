# Deploy AI Browser Guard site on Vercel (free)

1. Unzip this folder.
2. Go to https://vercel.com/signup and sign up (GitHub / Google / email).
3. In this folder run:  npx vercel --prod
   (framework = Other, build command = empty, output directory = ./ )
   Or push the folder to GitHub -> Vercel -> Add New -> Project -> Import -> Framework "Other" -> Deploy.
4. Add your own domain under Project -> Settings -> Domains (optional).
5. After you know the final URL, make og:image absolute in index.html.

## Replace the Chrome Web Store link
All "Add to Chrome" / "Install the extension now" buttons (5 of them) use one URL.
Open index.html, search for:
  https://chromewebstore.google.com/detail/monk-focus/dagfandmfdlbgdgelnbeiacmchjihpnd
and replace all occurrences with your extension's store URL.
