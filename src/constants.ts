export const CATEGORIES = {
  Animals: [
    "Lion", "Tiger", "Elephant", "Giraffe", "Penguin", "Kangaroo", "Panda", "Koala", "Dolphin", "Shark",
    "Octopus", "Eagle", "Owl", "Wolf", "Fox", "Bear", "Zebra", "Cheetah", "Sloth", "Hippopotamus"
  ],
  Cities: [
    "Paris", "London", "New York", "Tokyo", "Rome", "Berlin", "Sydney", "Dubai", "Singapore", "Barcelona",
    "Amsterdam", "Venice", "Rio de Janeiro", "Cairo", "Moscow", "Seoul", "Bangkok", "Istanbul", "Toronto", "Mumbai"
  ],
  Celebrities: [
    "Taylor Swift", "Tom Cruise", "Zendaya", "Beyoncé", "Leonardo DiCaprio", "Rihanna", "Brad Pitt", "Ariana Grande",
    "Dwayne Johnson", "Selena Gomez", "Justin Bieber", "Lady Gaga", "Kanye West", "Kim Kardashian", "Elon Musk",
    "Bill Gates", "Oprah Winfrey", "Will Smith", "Margot Robbie", "Ryan Reynolds", "Scarlett Johansson", "Chris Hemsworth",
    "Robert Downey Jr.", "Meryl Streep", "Tom Hanks", "Jennifer Lawrence", "Drake", "Ed Sheeran", "Adele", "Bruno Mars"
  ]
};

export type Category = keyof typeof CATEGORIES;
