
for URL in `cat crunchify.txt`; do echo $URL; curl -m 10 -s -I $1 "$URL" | grep HTTP/1.1 |  awk {'print $2'}; done