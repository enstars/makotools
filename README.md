<h3 align="center">
<img width="128" height="128" src="https://user-images.githubusercontent.com/58155530/178722797-78504a19-19f4-4f4b-a09a-23239854b50d.svg">
</h2>
<H1 align="center">MakoTools</h1>

<h3 align="center"><img src="https://img.shields.io/website?down_color=ed8796&down_message=offline&label=status&logo=vercel&style=for-the-badge&up_color=8aadf4&up_message=online&url=https%3A%2F%2Fstars.ensemble.moe&labelColor=302D41"> <img src="https://img.shields.io/github/checks-status/enstars/makotools/main?color=8bd5ca&label=main&logo=github&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/github/license/enstars/makotools?color=c6a0f6&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/github/issues/enstars/makotools?color=eed49f&logo=github&style=for-the-badge&labelColor=302D41"><br><img src="https://img.shields.io/twitter/follow/enstarseng?color=7dc4e4&label=@enstarseng&logo=twitter&logoColor=fff&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/twitter/follow/enstars_link?color=7dc4e4&label=@Enstars_link&logo=twitter&logoColor=fff&style=for-the-badge&labelColor=302D41"></h3>

MakoTools is a website containing information, tools, and a lot more to aid you in playing Ensemble Stars!! Music English Version, created in collaboration between <a href="https://twitter.com/enstars_link" target="_blank">EN:Link</a>, The <a href="https://ensemble-stars.fandom.com" target="_blank">English</a> / <a href="https://ensemblestars.huijiwiki.com" target="_blank">Chinese</a> Ensemble Stars Wiki, and <a href="https://twitter.com/DaydreamGuides" target="_blank">Daydream Guides</a>.

## Data Sources

### Game Assets
- Curated at [gradualcolors' Google Drive folder](https://drive.google.com/drive/folders/1wTEb46GrGIlAK0lhhN6Ihm4l40GJPkDj)
  - Contains data from @gradualcolors, Daydream
- Accessible at https://assets.ensemble.link/{path/to/file} (Hosted on Backblaze B2)

### Source Game Data
- Curated at [enstars/data](https://github.com/enstars/data)
  - Contains data from @gradualcolors, @watatomo, Daydream
- Accessible at https://data.ensemble.moe/{lang}/{data}.json (Hosted on GitHub sites)

### Unofficially Translated Data
- Curated at [enstars/enstars-tl](https://github.com/enstars/enstars-tl)
  - Contains data from The English Ensemble Stars Wiki
- Accessible at https://tl.data.ensemble.moe/{lang}/{data}.json (Hosted on Cloudflare Pages)

## Development
<img src="https://img.shields.io/github/checks-status/enstars/makotools/development?color=8bd5ca&label=dev&logo=github&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/website?down_color=ed8796&down_message=offline&label=dev%20status&logo=vercel&style=for-the-badge&up_color=8aadf4&up_message=online&url=https%3A%2F%2Fstars.ensemble.moe&labelColor=302D41">

### How to Set Up Locally
1. Install node.js and NPM. Follow the instructions [here](https://docs.npmjs.com/cli/v8/configuring-npm/install) depending on your operating system.
2. Install yarn. In the terminal, run `npm install --global yarn`.
3. Run `yarn install` to install the required packages to your repository.
4. These next few steps will vary depending on how you want to run the project. Running in **development** mode will allow you to update the project as you update the code. Meanwhile, running in **production** mode will create a build by validating the code of the project and run that build.

#### Running in Production mode
1. By default, the run environment will be set to production. First, run `yarn run build` to create a build for the project. If the build process returns any errors, submit an issue.
2. Run `yarn run start` to launch the program.

#### Running in Development mode
1. Since development mode is not the default for the run environment, set the environment to development.<br />
In a Unix terminal (MacOS, LinuxOS, etc.), run `export NODE_ENV=development` . <br />
In Windows Command Prompt or PowerShell, run `set NODE_ENV=development`.
2. To verify this updated `NODE_ENV`, run `echo $NODE_ENV` (Unix), or `set NODE_ENV` (Windows CMD/PowerShell). Either `development` (Unix) or `NODE_ENV=development` (Windows CMD) should be returned.
3. Run `yarn run dev`. If any errors occur, please submit an issue.


### Repository Structure
The repository is currently organized by file type.
- Image files (.png, .svg, etc) are located in `/assets`
- JSON files and other data files are located in `/data`
- Stylesheets (.css, .scss) are located in `/styles`
Due to Next.js formatting requirements, .jsx files are organized based on whether they contain components or webpages. Components are located in `/components` and webpages are located in `/pages`.

If new volunteers have any questions, message us on Discord! This README will be updated as development continues.
