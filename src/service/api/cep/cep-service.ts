import axios from 'axios';
import { HttpResponse } from '../../http/types';
import { normalizeResponse } from '../../http/fetch';
import { Address } from './types';

export const fetchAddress = async (
  cep: string,
): Promise<HttpResponse<Address>> => {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(url)
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    const address = {
      uf: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      address: data.logradouro,
    };

    response = normalizeResponse(address, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};
