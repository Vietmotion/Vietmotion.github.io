#!/bin/bash
rm -rf docs/*
mkdir -p docs/assets
cp index.html docs/
cp style.css docs/
cp -r assets/* docs/assets/
touch docs/.nojekyll
