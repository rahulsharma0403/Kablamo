Please follow the below steps to run the project successfully:

Step 1: Install the latest node version.
Step 2: Install JAVA on the local system and set the environment variable (for Allure Reporting)
        Variable name: JAVA_HOME 
        Value: JAVA Path such as C:\Program Files (x86)\Java\jre1.8.0_421
Step 3: Open the Visual Studio and open the project folder.
Step 4: Go to Terminal and execute command: npm install playwright
Step 5: To RUN the project, go to Terminal and write: npx playwright test Kablamo.test.ts 
Step 6: To OPEN the Allure report, go to Terminal and write: npm run report 
Step 7: To OPEN the default HTML report, locate the project folder on the local device and open the playwright-report folder. 

Note: All the data extracted through API requests is stored in a CSV file and can be located inside /src/report folder. This report will contain the average Forex Conversion rate.
      Also I have printed the average forex rate in the console logs as well.
