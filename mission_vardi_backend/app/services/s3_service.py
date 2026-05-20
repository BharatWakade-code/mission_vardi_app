import boto3
import json
from botocore.exceptions import NoCredentialsError, ClientError

s3 = boto3.client("s3")

# Note: Ensure you have your AWS credentials configured locally using `aws configure`
DATA_BUCKET = "mission-vardi-data"

def save_document(collection, doc_id, data):
    key = f"{collection}/{doc_id}.json"

    try:
        s3.put_object(
            Bucket=DATA_BUCKET,
            Key=key,
            Body=json.dumps(data),
            ContentType="application/json"
        )
    except NoCredentialsError:
        print("ERROR: AWS Credentials not found. Please run 'aws configure' in your terminal.")
        raise
    except Exception as e:
        print(f"ERROR: Failed to save to S3. {e}")
        raise

def get_document(collection, doc_id):
    key = f"{collection}/{doc_id}.json"

    try:
        response = s3.get_object(
            Bucket=DATA_BUCKET,
            Key=key
        )
        return json.loads(response["Body"].read())
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            return None
        raise
    except NoCredentialsError:
        print("ERROR: AWS Credentials not found. Please run 'aws configure' in your terminal.")
        raise

def list_documents(prefix):
    try:
        response = s3.list_objects_v2(
            Bucket=DATA_BUCKET,
            Prefix=prefix
        )
        if 'Contents' not in response:
            return []
        
        documents = []
        for obj in response['Contents']:
            try:
                res = s3.get_object(Bucket=DATA_BUCKET, Key=obj['Key'])
                doc = json.loads(res["Body"].read())
                documents.append(doc)
            except Exception as e:
                print(f"ERROR: Failed to fetch {obj['Key']}: {e}")
                
        return documents
    except NoCredentialsError:
        print("ERROR: AWS Credentials not found. Please run 'aws configure' in your terminal.")
        raise
    except Exception as e:
        print(f"ERROR: Failed to list documents. {e}")
        raise
