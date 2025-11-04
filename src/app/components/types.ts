export type Participant = {
  id: string;
  name: {
    formatFullName: string;
    formatSurname: string;
    formatName: string;
  };
  avatar: "Masculino" | "Feminino" | string;
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
  chosen: boolean;
  createdAt: string;
  updatedAt: string;
};
