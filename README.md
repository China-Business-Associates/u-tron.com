# u-tron.com Static Site

## Publishing / Deployment

Do not upload `.git` or `.gitignore` to webserver.

```bash
rsync -avz --delete --exclude='.git*' ./ cba_admin1@u-tron.com:/home/cba_admin1/u-tron.com/
```
