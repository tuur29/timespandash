
# Angular build
rm -rf dist
ng build -prod --base-href "./"

# rewrite base element so app works locally
# <base href="./">
# <script>document.write(`<base href="${document.location}" />`)</script>
sed -i -e 's#<base href=\".\/\">#<script>document.write(`<base href="${document.location}" \/>`)<\/script>#g' dist/index.html

# add fonts
sed -i -e 's#<\/head>#<link href="localfonts.css" rel="stylesheet"></head>#g' dist/index.html
cp localassets/* dist


echo -e "\n\n Built!\n"
