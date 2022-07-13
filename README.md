<h3 align="center">
<img width="128" height="128" src="https://user-images.githubusercontent.com/58155530/178722797-78504a19-19f4-4f4b-a09a-23239854b50d.svg">
</h2>
<H1 align="center">MakoTools</h1>

<h3 align="center"><img src="https://img.shields.io/website?down_color=ed8796&down_message=offline&label=status&logo=vercel&style=for-the-badge&up_color=8aadf4&up_message=online&url=https%3A%2F%2Fstars.ensemble.moe&labelColor=302D41"> <img src="https://img.shields.io/github/checks-status/enstars/makotools/main?color=8bd5ca&label=main&logo=github&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/github/license/enstars/makotools?color=c6a0f6&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/github/issues/enstars/makotools?color=eed49f&logo=github&style=for-the-badge&labelColor=302D41"><br><img src="https://img.shields.io/twitter/follow/enstarseng?color=7dc4e4&label=@enstarseng&logo=twitter&logoColor=fff&style=for-the-badge&labelColor=302D41"> <img src="https://img.shields.io/twitter/follow/enstars_link?color=7dc4e4&label=@Enstars_link&logo=twitter&logoColor=fff&style=for-the-badge&labelColor=302D41"></h3>

MakoTools is a website containing information, tools, and a lot more to aid you in playing Ensemble Stars!! Music English Version, created in collaboration between <a href="https://twitter.com/enstars_link" target="_blank">EN:Link</a>, The <a href="https://ensemble-stars.fandom.com" target="_blank">English</a> / <a href="https://ensemblestars.huijiwiki.com" target="_blank">Chinese</a> Ensemble Stars Wiki, and <a href="https://twitter.com/DaydreamGuides" target="_blank">Daydream Guides</a>.

## Data Sources
> *Todo: Rename these two repos to match*

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

### How to set up locally
1. In the root directory of the project, run `yarn install` in the terminal. This will add all of the necessary packages to your instance of the project.
2. Set the `NODE_ENV` variable.  
Input the following in the terminal depending on your OS:  
Linux and Mac: `export NODE_ENV=development yarn run dev`  
Windows: `$env:NODE_ENV = 'development yarn run dev'`  

Then, input `echo $NODE_DEV`. If done correctly, the terminal should return `development`.
3. Run `yarn run dev`. If everything is working correctly, you should be greeted with Ukki's wonderful face!

If new volunteers have any questions, message us on Discord! This README will be updated as development continues.
