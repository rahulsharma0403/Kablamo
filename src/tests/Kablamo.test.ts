import { test, expect } from '@playwright/test';
import { closeApiContext, fetchExchangeRates, generateCSVReport, initApiContext } from '../utils/apiUtils';


const currenciesList = [
    { base: 'CAD', target: 'AUD', weeks: '10' },
    //{ base: 'XXX', target: 'XXX', weeks: '10' },  // We can run for multiple currencies or can change the same in taget and base as well
    //{ base: 'XXX', target: 'XXX', weeks: '10' },   
];

test.beforeAll(async () => {
    await initApiContext();
});

test.afterAll(async () => {
    await closeApiContext();
});

test.describe('Forex API Tests', () => {
    currenciesList.forEach(({ base, target, weeks }) => {
        test(`Should fetch the most recent exchange rates for ${base} to ${target}`, async () => {
            try {
                const data = await fetchExchangeRates(base, target, `recent_weeks=${weeks}`);
                const reportData = data.observations.map((obs: any) => ({
                    date: obs.d,
                    value: obs[`FX${base}${target}`]?.v || 'N/A',
                    currency: `${base} to ${target}`
                }));

                // Calculate the average exchange rate
                const values = data.observations.map((obs: any) => parseFloat(obs[`FX${base}${target}`]?.v || '0'));
                const total = values.reduce((sum: number, value: number) => sum + value, 0);
                const average = total / values.length;
                expect(average).toBeGreaterThan(0);
                console.log("The average is: " +  average);  // Print the average in console logs

                // Prepare and save the report as CSV
                await generateCSVReport(reportData, average, base, target)

                // Positive assertions
                expect(data).toBeDefined();
                expect(data).toHaveProperty('observations');
                expect(data.observations).toBeInstanceOf(Array);
                expect(data.observations.length).toBeGreaterThan(0);

                // Check that each observation has a date
                data.observations.forEach((obs: any) => {
                    expect(obs).toHaveProperty('d');
                    expect(typeof obs.d).toBe('string');
                    expect(obs.d).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Validate date format YYYY-MM-DD

                    // Check that each observation has an exchange rate value
                    const currencyPairKey = `FX${base}${target}`;
                    expect(obs).toHaveProperty(currencyPairKey);
                    expect(obs[currencyPairKey]).toHaveProperty('v');
                    expect(typeof obs[currencyPairKey].v).toBe('string'); // or 'number' if it's a number

                    // Optionally, validate the value format (e.g., is it a number?)
                    expect(!isNaN(parseFloat(obs[currencyPairKey].v))).toBe(true);
                });
            } catch (error) {
                console.error(`Error fetching exchange rates for ${base} to ${target}:`, error);
                throw error;
            }
        });
    });

    // Error handling tests
    test('should handle invalid currency pairs gracefully', async () => {
        try {
            const data = await fetchExchangeRates('CAD', 'ZZZ', 'recent_weeks=10');
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('Invalid currency');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toContain('Failed to fetch data');
            }
        }
    });

    test('should handle invalid query parameters gracefully', async () => {
        try {
            const data = await fetchExchangeRates('CAD', 'AUD', 'recent_weeks=invalid');
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('Invalid query parameter');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toContain('Failed to fetch data');
            }
        }
    });

    test('should handle HTTP 404 Not Found response', async () => {
        try {
            const response = await fetchExchangeRates('CAD', 'AUD', 'non_existent_param');
            expect(response.status()).toBe(404); // Ensure status code is 404
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('Not Found');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toContain('Failed to fetch data');
            }
        }
    });

    test('should handle HTTP 500 Internal Server Error response', async () => {
        try {
            const response = await fetchExchangeRates('CAD', 'AUD', 'server_error_param');
            expect(response.status()).toBe(500); // Ensure status code is 500
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('Internal Server Error');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toContain('Failed to fetch data');
            }
        }
    });

    test('should handle HTTP 400 Bad Request response', async () => {
        try {
            const response = await fetchExchangeRates('CAD', 'AUD', 'bad_request_param');
            expect(response.status()).toBe(400); // Ensure status code is 400
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('Bad Request');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toContain('Failed to fetch data');
            }
        }
    });
});