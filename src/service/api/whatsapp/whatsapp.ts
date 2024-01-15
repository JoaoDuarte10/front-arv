export class WhatsAppService {
  redirectToWhatsappWithMessage(params: {
    id: number;
    event: React.BaseSyntheticEvent;
    client: string;
    phone: string;
    date: string;
    time: string;
    totalAtendenceCount: number;
    atendenceCount: number;
    description: string;
    services: string[];
  }): void {
    params.event.preventDefault();
    const isPacote = params.totalAtendenceCount
      ? `Esse é o ${params.atendenceCount + 1}º dia do pacote. \n`
      : '';
    const dateUrl = new Date(params.date).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    });
    const text = `Olá ${params.client.trim()}, tudo bem? \nPosso confirmar o horário que agendamos para dia ${dateUrl} às ${
      params.time
    } horas? \n${isPacote}\nProcedimentos: ${params.services
      .map(service => service.trim())
      .join(', ') || params.description.trim()}.\n\nCódigo do agendamento: ${
      params.id
    } \n\nAguardo seu retorno!`;

    const URL = `https://api.whatsapp.com/send?phone=55${params.phone}&text=`;
    const redirect = window.encodeURIComponent(text);
    window.open(URL + redirect, '_blank');
  }

  redirectToWhatsapp(event: React.SyntheticEvent, contact: string): void {
    event.preventDefault();
    const URL = `https://api.whatsapp.com/send?phone=55${contact.replace(
      /[^0-9]+/g,
      '',
    )}`;
    window.open(URL, '_blank');
  }
}
