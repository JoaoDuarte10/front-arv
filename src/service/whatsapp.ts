export class WhatsAppService {
  redirectToWhatsappWithMessage(params: {
    event: React.BaseSyntheticEvent;
    client: string;
    contact: string;
    date: string;
    time: string;
    qtdTotalAtendimento: number;
    qtdAtendimento: number;
    procedure: string;
  }): void {
    params.event.preventDefault();
    const isPacote = params.qtdTotalAtendimento
      ? `Esse é o ${params.qtdAtendimento + 1}º dia do pacote. \n`
      : "";
    const dateUrl = new Date(params.date).toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
    const text = `Olá ${params.client}, posso confirmar o horário que agendamos para dia ${dateUrl} às ${params.time} horas? \n${isPacote}\nProcedimento: ${params.procedure} \nAguardo seu retorno!`;
    const URL = `https://api.whatsapp.com/send?phone=55${params.contact}&text=`;
    const redirect = window.encodeURIComponent(text);
    window.open(URL + redirect, "_blank");
  }

  redirectToWhatsapp(event: React.SyntheticEvent, contact: string): void {
    event.preventDefault();
    const URL = `https://api.whatsapp.com/send?phone=55${contact.replace(
      /[^0-9]+/g,
      ""
    )}`;
    window.open(URL, "_blank");
  }
}
