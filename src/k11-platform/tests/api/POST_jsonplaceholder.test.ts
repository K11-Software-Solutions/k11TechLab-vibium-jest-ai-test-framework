import { APIUtil } from '../../../utils/APIUtil';

const apiUtil = new APIUtil();
const JSONPLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com';

test('jsonplaceholder_Post: should POST and validate response', async () => {
  const payload = { title: 'foo', body: 'bar', userId: 1 };
  const response = await fetch(`${JSONPLACEHOLDER_API_URL}/posts`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  expect(response.status).toBe(201);
  const body = await response.json();
  await apiUtil.saveApiResponse('post_jsonplaceholder', body);
  await apiUtil.assertResponseBodyKeys(['id', 'title', 'body', 'userId'], body as Record<string, any>, 'JSON Body');

  // Optional: verify content-type header exists
  const headersArray: { name: string; value: string }[] = [];
  response.headers.forEach((value, name) => {
    headersArray.push({ name, value });
  });
  await apiUtil.assertResponseHeaders('content-type', headersArray, 'Response Headers');
});
