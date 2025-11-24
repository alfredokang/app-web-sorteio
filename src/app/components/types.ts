export type Participant = {
  id: string;
  name: {
    formatFullName: string;
    formatSurname: string;
    formatName: string;
  };
  avatar: "male" | "female" | "neutral" | string;
  avatarUrl: string;
  cpfCliente: string;
  phone: {
    phoneWithoutCode: string;
    phoneClean: string;
    formatPhone: string;
  };
  questionOne: {
    whichCoffee: string;
  };
  questionTwo: {
    purchasePurpose: string;
  };
  questionThree: {
    minasCafeRate: number;
    followUp: string | null;
  };
  questionFour: {
    considerExchange?: string;
  };
  prize: {
    id: string;
    title: string;
    description: string;
  };
  chosen: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Prizes = {
  order: number;
  drawn: boolean;
  tile: string;
  description: string;
  prizeType: string;
  winnerId: string;
  winnerName: string;
  winnerPhone: string;
  createdAt: string;
  updatedAt: string;
};
