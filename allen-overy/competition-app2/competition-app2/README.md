#curl commands

##ETag Issue

New Call
curl -vX GET 'https://cdn.contentful.com/spaces/zpp0viuq4x1e/entries?content_type=4sXD3yB2A8UgwG6Q8meY0K&access_token=31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60'

Call with ETag
curl -vX GET -H 'If-None-Match: "42479efc75f724a69a9e109ca53f5768"' 'https://cdn.contentful.com/spaces/zpp0viuq4x1e/entries?content_type=4sXD3yB2A8UgwG6Q8meY0K&access_token=31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60'

ETag: "e2ec662243ddbb17e7d5568b37ee947b"

ETag: "e2ec662243ddbb17e7d5568b37ee947b"

https://furrmao@github.com/AllenOvery/competition-app-dev.git