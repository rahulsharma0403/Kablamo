import { request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/config';
import path from 'path';
import fs from 'fs';

let apiContext: APIRequestContext;

export const initApiContext = async () => {
  apiContext = await playwrightRequest.newContext();
};

export const fetchExchangeRates = async (baseCurrency: string, targetCurrency: string, queryParams: string = '') => {
  const url = `${BASE_URL}/FX${baseCurrency}${targetCurrency}/json${queryParams ? `?${queryParams}` : ''}`;
  const response = await apiContext.get(url);
  if (!response.ok()) {
    throw new Error(`Failed to fetch data (Status: ${response.status()} - ${response.statusText()})`);
  }
  return response.json(); // Directly parse JSON
};


// Function to write report to a file
export const generateCSVReport = async (reportData: any[], average: number, baseCurrency: string, targetCurrency: string) => {
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }
  const reportPath = path.join(reportsDir, 'forex_report.csv');
  let reportContent = 'Date,Value and Currency\n';
  reportData.forEach(({ date, value, currency }) => {
    reportContent += `${date}, ${value} ${currency}\n`;
  });
  reportContent += `\nAverage Exchange Rate: ${average.toFixed(4)} ${baseCurrency} to ${targetCurrency}`;
  fs.writeFileSync(reportPath, reportContent);
  console.log(`Report generated at: ${reportPath}`);
};



export const closeApiContext = async () => {
  await apiContext.dispose();
};