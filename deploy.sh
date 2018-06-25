
# Angular build
read -n1 -rep $'\nPress key if there are no uncommited changes\n' key
rm -rf dist
sed -i -e 's/\/dist/#\/dist/g' .gitignore
ng build -prod --aot=false --base-href "./"
read -n1 -rep $'\nPress key if angular app has build successfully\n' key
cp "dist/index.html" "dist/404.html"

# Deploy to Github Pages
git add .
git commit -m "deploy"
git push origin `git subtree split --prefix dist master`:gh-pages --force
git reset HEAD~
git checkout -- .

echo -e "\n\n Deployed!\n"
