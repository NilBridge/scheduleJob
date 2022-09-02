chcp 65001

if exist tmp (
    rd tmp /s
)


md tmp
md "tmp/scheduleJob"

xcopy src "tmp/scheduleJob" /s /e /exclude:%cd%\pack.config
::xcopy package.json "tmp/scheduleJob/" /F

cd 7z

7za.exe a ../tmp/scheduleJob.zip ../tmp/scheduleJob/*

cd ../tmp

REN scheduleJob.zip scheduleJob.llplugin