POST / :

- **Description**: Takes in a keyword, scrapes data, and returns a list of product search results.
- **Method**: POST
- **Parameters**:
  - `keyword` (string): The search term to scrape data for.
- **Request Example**:
  ```json
  {
    "keyword": "smartphone"
  }
  ```
- **Response Example**:
  ```json
  [
    {
      "productName": "Smartphone X",
      "price": "$699",
      "url": "https://example.com/product/smartphone-x",
      "imageUrl": "https://example.com/product/smartphone-x.jpg"
    },
    {
      "productName": "Smartphone Y",
      "price": "$799",
      "url": "https://example.com/product/smartphone-y",
      "imageUrl": "https://example.com/product/smartphone-y.jpg"
    }
  ]
  ```

GET /history :

- **Description**: Takes in a user ID and returns a list of recent keywords.
- **Method**: GET
- **Parameters**:
  - `userId` (string): The ID of the user.
- **Request Example**:
  ```json
  {
    "userId": "12345"
  }
  ```
- **Response Example**:
  ```json
  ["smartphone", "laptop", "headphones"]
  ```

POST /history :

- **Description**: Takes in a user ID and a keyword, adds the keyword to the UserHistory table, and returns the keyword.
- **Method**: POST
- **Parameters**:
  - `userId` (string): The ID of the user.
  - `keyword` (string): The keyword to add.
- **Request Example**:
  ```json
  {
    "userId": "12345",
    "keyword": "tablet"
  }
  ```
- **Response Example**:
  ```json
  {
    "keyword": "tablet"
  }
  ```

DELETE /history :

- **Description**: Takes in a user ID and a keyword, removes the keyword from the UserHistory table, and returns the keyword.
- **Method**: DELETE
- **Parameters**:
  - `userId` (string): The ID of the user.
  - `keyword` (string): The keyword to remove.
- **Request Example**:
  ```json
  {
    "userId": "12345",
    "keyword": "tablet"
  }
  ```
- **Response Example**:
  ```json
  {
    "keyword": "tablet"
  }
  ```
