export type Participant = {
  id: string;
  name: string;
  gender: "male" | "female";
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
};
