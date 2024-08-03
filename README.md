# Kablamo

Step 1: Install node.js from https://nodejs.org/en/download/prebuilt-installer and install the same.
Step 1: Run the command in the visual studio termianl npx install playwright@latest
Step 2: Install JAVA on local system and setup environment variable (for Allure Reporting)
Step 3: Restart the system if environment variable (java) was not setup
Step 4: To run project, type npx playwright test Kablamo.test.ts on terminal
Step 5: To open report, type npm run report on terminal
Step 6: To open default html report, locate the project folder on local device and open playwright-report folder
Step 7: All the data extracted through api request, is stored in a csv file and can be located inside /src/report. This report will contain the average as well.
