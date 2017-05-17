#!/bin/bash

# Extract the package
tar -xzf package.tgz
rm package.tgz

touch archive/public/built/top.txt
mv -f archive/public/built ./public/

rm -rf archive
