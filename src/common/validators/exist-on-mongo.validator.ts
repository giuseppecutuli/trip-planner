import { Injectable, Logger } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

type existsOnDatabaseOptions = {
  model: string
  column: string
}

@ValidatorConstraint({ name: 'ExistOnMongo', async: true })
@Injectable()
export class MongoExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  async validate(value: string | number, args: ValidationArguments): Promise<boolean> {
    const [property] = args.constraints
    const { model: modelName, column: columnName } = property

    if (this.connection.modelNames().indexOf(modelName) === -1) {
      throw new Error(`model ${modelName} does not exist on the database.`)
    }

    const Model = this.connection.model(modelName)

    try {
      const exist = await Model.exists({ [columnName]: value })

      return exist !== null
    } catch (e) {
      Logger.error(e)

      return false
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [property] = args.constraints
    const { model: modelName, column: columnName } = property

    return `model ${modelName} with the ${columnName} provided does not exist on the database.`
  }
}

export const ExistOnMongo = (existsOnDatabaseOptions: existsOnDatabaseOptions, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [existsOnDatabaseOptions],
      validator: MongoExistValidator,
    })
  }
}
