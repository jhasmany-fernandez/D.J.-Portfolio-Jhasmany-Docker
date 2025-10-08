import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private contactRepository;
    constructor(contactRepository: Repository<Contact>);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    findOne(id: string): Promise<Contact>;
    markAsRead(id: string): Promise<Contact>;
    markAsReplied(id: string): Promise<Contact>;
    remove(id: string): Promise<void>;
    getUnreadCount(): Promise<number>;
}
