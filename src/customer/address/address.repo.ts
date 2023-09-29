import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerRepo } from '../customer.repo';
import { Address } from './address.schema';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressRepo {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto, customerId: string) {
    try {
      const createdAddress = new this.addressModel({
        ...createAddressDto,
        customer: customerId,
      });
      return await createdAddress.save();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('failed to create address');
    }
  }
}
