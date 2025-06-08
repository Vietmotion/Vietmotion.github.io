#!/bin/bash

rm -rf docs/*
mkdir -p docs

cp index.html docs/
cp -r img docs/
cp -r style docs/
cp -r Sound docs/
cp -r style.css docs/
touch docs/.nojekyll
