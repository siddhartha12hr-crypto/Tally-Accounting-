@echo off
cd /d "c:\Users\Gareema\Desktop\tally accounting\Tally-Accounting-"
git add .
git commit -m "Fix movie detail navigation - move to /movie/$movieId route to bypass PinLock"
git push origin main
echo Done!
